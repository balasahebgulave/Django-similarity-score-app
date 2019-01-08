import numpy
import pandas as pd
import os
company_data = {}
industries = {}

class CompanyVector:
    def __init__(self, emp_count, industry,location, company_age, company_type):
        self.employee_count = numpy.array([emp_count])
        self.industry = self.get_vector(industry, total_industries)
        self.company_type = self.get_vector(company_type, total_types)
        # location = location.replace('(', '')
        # location = location.replace(')', '')
        # location = [float(x) for x in location.split(',')]
        self.location = numpy.array(location)
        self.vector = numpy.concatenate((self.employee_count, self.industry, self.company_type, location))
        self.vector_magnitude = numpy.linalg.norm(self.vector)
    
    def get_vector(self, val, size):
        val = int(val)
        size = int(size)
        temp = numpy.zeros(size)
        if val is not None:
            temp[val] = 1
        else:
            temp[0] = 1
        return temp

def sigmoid(x):
    if x == 1:
        return x
    return 1/(1+numpy.exp(-x))

def get_label_codes(data):
    key_dict = {}
    counter = 1
    for val in data:
        if val not in key_dict.keys():
            key_dict[val] = counter
            counter+=1
    return key_dict

def compare_company_vectors(vector1, vector2):
    return sigmoid((numpy.dot(vector1.vector, vector2.vector))/((vector1.vector_magnitude)*(vector2.vector_magnitude))) * 5

def get_company_vectors(data,ind_type_list):
    comp_types = {}
    for i,j in ind_type_list['total_types_list']:
        comp_types[j] = i
    global industries
    counter = 1
    for industry in data.values():
        if industry[1] not in industries.keys():
            industries[industry[1]] = counter
            counter+=1
    company_vectors = {}
    for name, vals in data.items():
        company_vectors[name] = CompanyVector(vals[0], industries[vals[1]], location_list[vals[2].lower()],vals[3],comp_types[vals[4]])
    return company_vectors


def read_file(file_obj):
    global location_list
    location_list = {}
    cities = pd.read_csv(r'cities.csv',header = -1)
    cities.columns = ['Name','Latitude','Longitude']
    print(cities.columns)
    Latitude = cities['Latitude'].values
    Longitude = cities['Longitude'].values
    for i,j in enumerate(cities.Name):
        location_list[j.lower()] = [Latitude[i],Longitude[i]]  
    data=pd.read_csv(file_obj, sep="|", encoding='latin-1')
    data['DS Company Type'] = data['DS Company Type'].fillna(value = 'Government Agency')
    # input_data = data[['Account name','Employee Count','Company Industry','Company City','Company Age','DS Company Type']].dropna()
    Y = data['Account name'].values
    X = data[['Employee Count','Company Industry','Company City','Company Age','DS Company Type']].values
    global total_industries
    global total_types
    total_industries = len(data['Company Industry'].unique())+1
    total_industry_list = list(enumerate(data['Company Industry'].unique()))
    total_types = len(data['DS Company Type'].unique())+1
    total_types_list = list(enumerate(data['DS Company Type'].unique()))
    ind_type_dict = {'total_types_list':total_types_list,'total_industry_list':total_industry_list}
    final_dict = {}
    for x, y in zip(X,Y):
        final_dict[y] = x
    return final_dict, ind_type_dict,location_list

