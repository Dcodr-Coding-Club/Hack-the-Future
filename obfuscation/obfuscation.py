import random
import itertools

# Define our four transformation layers and their reverse counterparts.

def shift_odd_even(chars):
    new_chars = list(chars)
    even_indices = [i for i in range(len(chars)) if i % 2 == 0]
    odd_indices = [i for i in range(len(chars)) if i % 2 == 1]
    
    if even_indices:
        # Shift even positions one left: first even becomes second even, last even wraps to first.
        for i in range(len(even_indices) - 1):
            new_chars[even_indices[i]] = chars[even_indices[i + 1]]
        new_chars[even_indices[-1]] = chars[even_indices[0]]
    
    if odd_indices:
        # Shift odd positions one right: last odd becomes first odd, others shift right.
        for i in range(len(odd_indices) - 1, 0, -1):
            new_chars[odd_indices[i]] = chars[odd_indices[i - 1]]
        new_chars[odd_indices[0]] = chars[odd_indices[-1]]
    
    return new_chars

def reverse_shift_odd_even(chars):
    new_chars = list(chars)
    even_indices = [i for i in range(len(chars)) if i % 2 == 0]
    odd_indices = [i for i in range(len(chars)) if i % 2 == 1]
    
    if even_indices:
        # Reverse even: shift right. So first even gets last even's value, others get previous.
        new_chars[even_indices[0]] = chars[even_indices[-1]]
        for i in range(1, len(even_indices)):
            new_chars[even_indices[i]] = chars[even_indices[i - 1]]
    
    if odd_indices:
        # Reverse odd: shift left.
        for i in range(len(odd_indices) - 1):
            new_chars[odd_indices[i]] = chars[odd_indices[i + 1]]
        new_chars[odd_indices[-1]] = chars[odd_indices[0]]
    
    return new_chars

def swap_positions(chars):
    pos1, pos2 = random.sample(range(len(chars)), 2)
    chars[pos1], chars[pos2] = chars[pos2], chars[pos1]
    return chars, f"{pos1}{pos2}"

def xor_chars(chars):
    xor_value = 5
    return [chr(ord(c) ^ xor_value) for c in chars]

def shift_bits(chars):
    return [chr((ord(c) << 1) & 0xFF) for c in chars]

def reverse_shift_bits(chars):
    return [chr(ord(c) >> 1) for c in chars]

def reverse_xor_chars(chars):
    xor_value = 5
    return [chr(ord(c) ^ xor_value) for c in chars]

def reverse_swap_positions(chars, swap_code):
    pos1, pos2 = int(swap_code[0]), int(swap_code[1])
    chars[pos1], chars[pos2] = chars[pos2], chars[pos1]
    return chars

# Precompute all permutations (orders) of the 4 layers.
# We'll use indices: 0 -> shift_odd_even, 1 -> swap_positions, 2 -> xor_chars, 3 -> shift_bits.
all_permutations = list(itertools.permutations([0, 1, 2, 3]))  # 24 permutations

# Map forward and reverse functions by index.
forward_funcs = [shift_odd_even, swap_positions, xor_chars, shift_bits]
reverse_funcs  = [reverse_shift_odd_even, reverse_swap_positions, reverse_xor_chars, reverse_shift_bits]

def obfuscate(ciphertext):
    if len(ciphertext) == 1:
        # For single character, still apply XOR and shift_bits.
        xor_value = 5
        ch = chr((ord(ciphertext) ^ xor_value) << 1 & 0xFF)
        # We'll use permutation index 0 for single-character case.
        return ch + "00" + "00", 0  # swap code "00", permutation code "00"
    
    # Choose a random permutation index from 0 to 23.
    perm_index = random.randint(0, 23)
    permutation = all_permutations[perm_index]  # tuple of indices for forward_funcs
    
    # We'll store the swap positions code when swap layer is applied.
    swap_code = "00"
    
    chars = list(ciphertext)
    # Apply layers in the chosen order.
    for idx in permutation:
        if idx == 1:  # swap_positions
            chars, swap_code = swap_positions(chars)
        else:
            chars = forward_funcs[idx](chars)
    
    # Append swap code (2 digits) and permutation index (2 digits, zero-padded).
    perm_code = f"{perm_index:02d}"
    obfuscated = ''.join(chars) + swap_code + perm_code
    return obfuscated, perm_index

def deobfuscate(obfuscated_text):
    if len(obfuscated_text) <= 4:
        # Single character case: last 4 chars are appended.
        xor_value = 5
        ch = obfuscated_text[0]
        return chr((ord(ch) >> 1) ^ xor_value)
    
    # The last 4 characters: first 2 are swap code, last 2 are permutation code.
    core_text = obfuscated_text[:-4]
    swap_code = obfuscated_text[-4:-2]
    perm_code = obfuscated_text[-2:]
    perm_index = int(perm_code)
    permutation = all_permutations[perm_index]
    
    # To reverse, we need to apply the reverse functions in the reverse order of the forward permutation.
    # Create a list of reverse functions corresponding to the forward order.
    reverse_order = []
    for idx in permutation:
        reverse_order.append(reverse_funcs[idx])
    
    # Reverse the order.
    reverse_order = reverse_order[::-1]
    
    chars = list(core_text)
    # Apply each reverse function in order.
    for func in reverse_order:
        if func == reverse_swap_positions:
            chars = reverse_swap_positions(chars, swap_code)
        else:
            chars = func(chars)
    
    return ''.join(chars)

# Example usage
if __name__ == "__main__":
    ciphertext = "12345"
    obfuscated_text, perm_index = obfuscate(ciphertext)
    decoded_text = deobfuscate(obfuscated_text)
    
    print(f"Original Text: {ciphertext}")
    print(f"Obfuscated Text: {obfuscated_text}")
    print(f"Decoded Text: {decoded_text}")
