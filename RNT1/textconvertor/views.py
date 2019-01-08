from django.shortcuts import render,redirect
from textconvertor.models import ImageViewer
from textconvertor.forms import ImageForm
from django.http import HttpResponse
# from textconvertor.ocr_process.process import startprocess
# from textconvertor.ocr_process.getText import startprocess, Predicted_Text
from textconvertor.getText import startprocess
from RNT1.settings import MEDIA_ROOT


def frontpage(request):
	return render(request, 'index.html')

def homepage(request):
	return render(request, 'base.html')


def form(request):
	try:
		if request.method=='POST':
			form=ImageForm(request.POST,request.FILES)

			if form.is_valid():
				form=form.save()
				form.save()
				return redirect('home')
			else:
				return HttpResponse("Something went wrong , Please try again.")

		else:

			form=ImageForm()
			return render(request,'form.html',{'form':form})
	except:
		return HttpResponse("Something went wrong , Please try again.")

def home(request):
	data=ImageViewer.objects.all()
	last=len(data)-1
	data=ImageViewer.objects.all()[last]

	# print('----------data---------',data.image)
	# print('-----output_url-----',output)

	output=startprocess(data.image)

	return render (request, 'detected_text.html', {'data':output})


def text(request):
	data=ImageViewer.objects.all()
	last=len(data)-1
	data=ImageViewer.objects.all()[last]

	# Text=Predicted_Text
	f=open(MEDIA_ROOT+'\\output.txt','r')
	Text=f.read()
	f.close()

	return render(request, 'text.html', {'text':Text})




# Create your views here.
