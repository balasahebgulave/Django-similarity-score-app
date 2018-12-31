from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.files.storage import FileSystemStorage
from .vector import *
import pandas as pd

# Create your views here.
def home(request):
    global company_data
    global company_vec
    if request.method == 'POST' and request.FILES['myfile']:
        myfile = request.FILES['myfile']
        company_data = read_file(myfile)
        company_vec = get_company_vectors(company_data)
        fs = FileSystemStorage()
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = fs.url(filename)
        return HttpResponseRedirect('score/')

    return render(request, 'SimilarityScore/upload.html')

def score_page(request):
    global company_vec
    if request.method == 'POST':
        scores_list = []
        employees = request.POST.get('company_head_count')
        industry = request.POST.get('company_industy')
        location = request.POST.get('company_location')
        com_type = request.POST.get('company_type')
        company_vector = CompanyVector(float(employees), location, float(industry), float(13), float(com_type), float(3))
        for key, value in company_vec.items():
            cosine_score = round(compare_company_vectors(company_vector, value), 3)
            scores_list.append({'Name': key, 'Score': cosine_score}) 
        context = {'scores' : scores_list}
        return render(request, 'SimilarityScore/score_page.html', context)
    return render(request, 'SimilarityScore/score_page.html')