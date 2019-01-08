from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.files.storage import FileSystemStorage
from .vector import *
import pandas as pd
from numpy import isnan
import requests
import sys

API_KEY = 'AIzaSyDLvngCL8mjx9f3bu3xjn4sd2KuuT7oSLs'

def get_maps_api_string(input_text):
    global API_KEY
    input_text = input_text.replace(' ','+')
    input_text = input_text.replace('\n', '+')
    maps_api_string = 'https://maps.googleapis.com/maps/api/geocode/json?address='+input_text+'&key='+API_KEY
    return maps_api_string

# Create your views here.
def home(request):
    global company_data
    global company_vec
    global location_list
    if request.method == 'POST' and request.FILES['myfile']:
        myfile = request.FILES['myfile']
        company_data,ind_type_list,location_list = read_file(myfile)
        # print(company_data)
        company_vec = get_company_vectors(company_data,ind_type_list)
        fs = FileSystemStorage()
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = fs.url(filename)
        return render(request, 'SimilarityScore/score_page.html',ind_type_list)

    return render(request, 'SimilarityScore/upload.html')

def score_page(request):
    global company_vec
    if request.method == 'POST':
        scores_list = []
        employees = request.POST.get('company_head_count')
        industry = request.POST.get('company_industy')
        location = request.POST.get('city')
        location = location_list[location.lower()]
        company_age = request.POST.get('company_age')
        com_type = request.POST.get('company_type')
        company_vector = CompanyVector(float(employees),float(industry),location,float(company_age),float(com_type))
        for key, value in company_vec.items():
            cosine_score = round(compare_company_vectors(company_vector, value), 3)
            if numpy.isnan(cosine_score):
                cosine_score = '0'
            else:
                cosine_score = str(cosine_score) + '/ 5'
            scores_list.append({'Name': key, 'Score': cosine_score})
        context = {'scores' : scores_list}
        print(context)
        return render(request, 'SimilarityScore/score_page.html', context)
    return render(request, 'SimilarityScore/score_page.html')
