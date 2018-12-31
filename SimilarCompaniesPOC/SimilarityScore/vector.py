import numpy
import pandas as pd

company_data = {}
industries = {}

class CompanyVector:
    def __init__(self, emp_count, location,industry, total_industries, company_type, total_types):
        self.employee_count = numpy.array([emp_count])
        self.industry = self.get_vector(industry, total_industries)
        self.company_type = self.get_vector(company_type, total_types)
        location = location.replace('(', '')
        location = location.replace(')', '')
        location = [float(x) for x in location.split(',')]
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

def get_company_vectors(data):
    comp_types = {'Government': 1, 'Private': 2}
    global industries
    counter = 1
    for industry in data.values():
        if industry[1] not in industries.keys():
            industries[industry[1]] = counter
            counter+=1
    
    company_vectors = {}
    for name, vals in data.items():
        company_vectors[name] = CompanyVector(vals[0], vals[2], industries[vals[1]], 13, comp_types[vals[3]], 3)
    return company_vectors


def read_file(file_obj):
    data = pd.ExcelFile(file_obj)
    data = data.parse('Sheet1')
    Y = data.iloc[:,0].values
    X = data.iloc[:-1, [12,13,19,24]].values
    final_dict = {}
    for x, y in zip(X,Y):
        final_dict[y] = x
    return final_dict

