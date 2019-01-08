from RNT1.settings import MEDIA_ROOT

import cv2
import numpy as np
import glob
import matplotlib.pyplot as plt
from glob import glob
from PIL import Image
import os
from keras.models import load_model
import tensorflow as tf
from django.core.cache import cache
from keras import backend as K
import datetime
import os.path
def output(array,space=False,nextline=False):

    array = array.reshape(-1,32,32,1)
    op = model.predict_classes([array])
    s = dic1[op[0]]
    if space:
        s+=" "
    if nextline:
        s+="\\n"
    return s

# def get_contour_precedence(contour, cols):
#     return contour[1] * cols + contour[0]

# Predicted_Text12=set()
def get_text(words,count1,str1,diff_y,diff_x,line=False):
    # print("printing str1 from get_text",str1)
    S=list("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-")
    global dic1
    dic1={}

    for i,j in enumerate(S):
        dic1[i]=j
    imgTrainingNumbers = words
    # print("In get_Text")
    imgGray = cv2.cvtColor(imgTrainingNumbers, cv2.COLOR_BGR2GRAY)
    imgBlurred = cv2.GaussianBlur(imgGray,(3,5), 0)
    imgThresh = cv2.adaptiveThreshold(imgBlurred,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY_INV,5,4)
    imgThreshCopy = imgThresh.copy()
    imgContours, npaContours, npaHierarchy = cv2.findContours(imgThreshCopy,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    # contours1=cv2.drawContours(imgGray,npaContours,-1,(0,0,255),0)
    count = 0
    label = count1
    list_sort = []
    list_sort1=[]
    for contour in npaContours:
        list_sort.append(cv2.boundingRect(contour))
        list_sort1 = sorted(list_sort,key = lambda x:x[0])

    # print(list_sort1)
    for k in range(len(list_sort1)):
        x,y,W,H = list_sort1[k][0],list_sort1[k][1],list_sort1[k][2],list_sort1[k][3]
        contours2 = cv2.rectangle(imgTrainingNumbers,(x,y),(x+W,y+H),(0,0,255),0)
        contours2 = imgThresh[y:y+H,x:x+W]
        contours2=cv2.resize(contours2,(12,12))
        tmp=np.zeros((32,32))
        image = contours2
        w,h = image.shape[:2]
        a = int((tmp.shape[0]- image.shape[0])/2)
        b = int((tmp.shape[1]-image.shape[1])/2)
        if w and h <= 32:
            for i in range(w):
                for j in range(h):
                    tmp[i+a][j+b] = image[i][j]
        else:
            pass

        str1 += output(tmp)
        if k==len(list_sort1)-1:
            pass
        else:
             if abs((x+W)-list_sort1[k+1][0])>=5:
                str1+=" "


        # cv2.imwrite(char+"\\"+str(label)+'_'+str(count)+'.png',tmp)
        count += 1
    str1+=" "*int(diff_x/12)

    if line:
        str1 += "\n" *int(diff_y/20)
    # print("String generated--------",str1)

    # Predicted_Text1.add(str1)
    # print('string is ',str1)
    return str1

Predicted_Text = set()
L=[]
def boundingBox(img, im_th,imFloodfillInv,base_image1):
    height,width,rgb=img.shape
    curr_dir= os.path.join(os.getcwd(), datetime.datetime.now().strftime(base_image1+'-%Y-%m-%d_%H-%M-%S'))
    os.makedirs(curr_dir)
    connectivity = 8
    labelnum, _, contours, _ = cv2.connectedComponentsWithStats(imFloodfillInv, connectivity)
    contours_order=[]
    line=0
    count=0
    line_cnt = 0
    blank_image=np.zeros((height,width,3),np.uint8)
    blank_image+=255
# subtracfrom present value to previous value in y-coordinates to take the differences.
    for i in range(0,len(contours)):
        try:
            ycoordinates_present_value=contours[i][1]
            ycoordinates_previous_value=contours[i+1][1]
            difference=abs(ycoordinates_present_value-ycoordinates_previous_value)
#             difference1=abs(contours[i][0]-contours[i+1][0])
#             print('k1---',k1)
            if difference>16:
#                 here while appending we will miss last values
                contours_order.append(contours[line:i+1])
                line=i+1
        except:
            pass
#          that's why we are appending onces again here for getting last value.
    contours_order.append(contours[line:])
# contours are sorted in x-coordinates using y_coordinates difference between the present and previous value.
    contours_in_sorted=[]
    for j in range(0,len(contours_order)):
        x1=sorted(contours_order[j],key=lambda x:x[0])
        contours_in_sorted.append(x1)
#     print(contours_in_sorted)
#  arranging in order according to the line in the image in one list.To access the x,y,h,w,size to get bounding box.
    contours_in_onelist=[]
    for l in range(0,len(contours_in_sorted)):
        for m in range(len(contours_in_sorted[l])):
            contours_in_onelist.append(contours_in_sorted[l][m])
#     print(contours_in_onelist)
    bb_img = img.copy()
    str1=" "
    for label in range(1,len(contours_in_onelist)):
        x,y,w,h,size = contours_in_onelist[label]
#         print(contours_in_onelist)
        if size<5000:
            try:
                diff_x=abs(contours_in_onelist[label][0]+contours_in_onelist[label][2]-contours_in_onelist[label+1][0])

                ynext=contours_in_onelist[label+1][1]
                yprev=contours_in_onelist[label-1][1]

                y_h=contours_in_onelist[label][1]+contours_in_onelist[label][3]
                y_h1=contours_in_onelist[label-1][1]+contours_in_onelist[label-1][3]

                x_prev=contours_in_onelist[label-1][0]
                x_present=contours_in_onelist[label][0]
                x_next=contours_in_onelist[label+1][0]

                diff_y_h=abs(y_h-y_h1)
                diff_y=abs(y-ynext)
                diff_y_prev=abs(y-yprev)

                if x_present == x_next or x_present >= x_prev:
                    line_cnt=line_cnt

                elif diff_y_h>h:
                    line_cnt+=1
                    count=0

                elif diff_y>5:
                    line=True
                else:
                    line=False
            except:
                pass
            bb_img = cv2.rectangle(bb_img, (x,y), (x+w,y+h), (0,0,255), 1)
            words = img[y:y+h,x:x+w]
            cv2.imwrite(curr_dir+'\\'+str(line_cnt)+'_'+str(count)+".png",words)
            blank_image[y:y+h,x:x+w]= words
            cv2.imwrite("BLANK.png",blank_image)
            str1 = get_text(words,count,str1,diff_y,diff_x,line)
            Predicted_Text.add(str1)
            count+=1
    cv2.imwrite("BB_result.png",bb_img)
    K.clear_session()
    file=open(MEDIA_ROOT+"/output.txt","w")
    file.write(str1)
    file.close()
    cv2.imwrite(MEDIA_ROOT+"/BB_result.png",bb_img)

def TextProcessing(path):

    base_image1=path
    base_image =cv2.imread(path)
    base_image = cv2.fastNlMeansDenoisingColored(base_image,None,10,10,7,21)
    gray_image = cv2.cvtColor(base_image, cv2.COLOR_BGR2GRAY)
    gray_image = gray_image.astype('uint8')
    Iedge = cv2.Canny(gray_image, 100, 200)
    kernel = np.ones((2,7), np.uint8)
    img_dilation = cv2.dilate(Iedge, kernel, iterations=1)
    th, im_th = cv2.threshold(img_dilation, 215, 255, cv2.THRESH_BINARY_INV);
    rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1,2))
    morph= cv2.morphologyEx(im_th, cv2.MORPH_CLOSE, rect_kernel)
    im_floodfill = morph.copy()
    h, w = im_th.shape[:2]
    mask = np.zeros((h+2, w+2), np.uint8)
    # mask1 = np.zeros((h+10, w+10), np.uint8)
    cv2.floodFill(im_floodfill, mask, (0,0), 255)
    im_floodfill_inv = cv2.bitwise_not(im_floodfill)

    global model
    model=load_model("latest.h5")

    boundingBox(base_image,im_th, im_floodfill_inv,base_image1)

def startprocess(imagepath):

    path = MEDIA_ROOT+'/'+str(imagepath)
    print('path is -------------',path)
    # print('---------imagepath-----------',path)
    TextProcessing(path)
    # output={'url':MEDIA_ROOT+'\\output\\BB_result.png'}
    output = '../media/output/BB_result.png'

    return output
