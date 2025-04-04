import gradio as gr
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

# Load model and processor
model_name = "Hemg/Indian-sign-language-classification"
processor = AutoImageProcessor.from_pretrained(model_name)
model = AutoModelForImageClassification.from_pretrained(model_name)

# Define prediction function
def sign_language_classification(image):
    """Predicts Indian sign language category for an input image."""
    try:
        image = Image.fromarray(image).convert("RGB")  # Convert image format
        inputs = processor(images=image, return_tensors="pt")

        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=1).squeeze().tolist()

        # Get model labels
        labels = model.config.id2label  # Hugging Face models store class labels here
        predictions = {labels[i]: round(probs[i], 3) for i in range(len(probs))}
        
        return predictions
    except Exception as e:
        return {"Error": str(e)}

# Create Gradio interface
iface = gr.Interface(
    fn=sign_language_classification,
    inputs=gr.Image(type="numpy"),
    outputs=gr.Label(label="Prediction Scores"),
    title="Indian Sign Language Detection",
    description="Upload an image to classify it into one of the Indian sign language categories."
)

# Launch the app
if __name__ == "__main__":
    iface.launch(share=True)
