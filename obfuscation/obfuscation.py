import random
import itertools

def shift_odd_even(chars):
    new_chars = list(chars)
    even_indices = [i for i in range(len(chars)) if i % 2 == 0]
    odd_indices = [i for i in range(len(chars)) if i % 2 == 1]

    if even_indices:
        for i in range(len(even_indices) - 1):
            new_chars[even_indices[i]] = chars[even_indices[i + 1]]
        new_chars[even_indices[-1]] = chars[even_indices[0]]

    if odd_indices:
        for i in range(len(odd_indices) - 1, 0, -1):
            new_chars[odd_indices[i]] = chars[odd_indices[i - 1]]
        new_chars[odd_indices[0]] = chars[odd_indices[-1]]

    return new_chars

def reverse_shift_odd_even(chars):
    new_chars = list(chars)
    even_indices = [i for i in range(len(chars)) if i % 2 == 0]
    odd_indices = [i for i in range(len(chars)) if i % 2 == 1]

    if even_indices:
        new_chars[even_indices[0]] = chars[even_indices[-1]]
        for i in range(1, len(even_indices)):
            new_chars[even_indices[i]] = chars[even_indices[i - 1]]

    if odd_indices:
        for i in range(len(odd_indices) - 1):
            new_chars[odd_indices[i]] = chars[odd_indices[i + 1]]
        new_chars[odd_indices[-1]] = chars[odd_indices[0]]

    return new_chars

def swap_positions(chars):
    pos1, pos2 = random.sample(range(len(chars)), 2)
    chars[pos1], chars[pos2] = chars[pos2], chars[pos1]
    return chars, f"{pos1:02}{pos2:02}"

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
    pos1, pos2 = int(swap_code[:2]), int(swap_code[2:])
    chars[pos1], chars[pos2] = chars[pos2], chars[pos1]
    return chars

all_permutations = list(itertools.permutations([0, 1, 2, 3]))

forward_funcs = [shift_odd_even, swap_positions, xor_chars, shift_bits]
reverse_funcs  = [reverse_shift_odd_even, reverse_swap_positions, reverse_xor_chars, reverse_shift_bits]

def obfuscate(ciphertext):
    perm_index = random.randint(0, 23)
    permutation = all_permutations[perm_index]

    swap_code = "0000"
    chars = list(ciphertext)

    for idx in permutation:
        if idx == 1:
            chars, swap_code = swap_positions(chars)
        else:
            chars = forward_funcs[idx](chars)

    perm_code = f"{perm_index:02d}"
    obfuscated = ''.join(chars) + swap_code + perm_code
    return obfuscated, perm_index

def deobfuscate(obfuscated_text):
    core_text = obfuscated_text[:-6]
    swap_code = obfuscated_text[-6:-2]
    perm_code = obfuscated_text[-2:]
    perm_index = int(perm_code)
    permutation = all_permutations[perm_index]

    reverse_order = [reverse_funcs[idx] for idx in permutation][::-1]

    chars = list(core_text)
    for func in reverse_order:
        if func == reverse_swap_positions:
            chars = reverse_swap_positions(chars, swap_code)
        else:
            chars = func(chars)

    return ''.join(chars)

if __name__ == "__main__":
    ciphertext = "lkasjlkjdslakhfkjdsbnkjbdsasdasd"
    obfuscated_text, perm_index = obfuscate(ciphertext)
    decoded_text = deobfuscate(obfuscated_text)

    print(f"Original Text: {ciphertext}")
    print(f"Obfuscated Text: {obfuscated_text}")
    print(f"Decoded Text: {decoded_text}")
