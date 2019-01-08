
from django import forms
from textconvertor.models import ImageViewer

class ImageForm(forms.ModelForm):
	class Meta:
		model=ImageViewer
		fields='__all__'