#!/usr/bin/python
# -*- coding: UTF-8 -*-
#该脚本在每一个测试单元测试结束后运行，用来对当前指纹log进行去重


'''
    list为获取指纹对象列表（其中可能存在操作失误，导致重复的情况，
    indexlist为某重复元素在该list中的所有下标列表
    该函数返回其中包含最长长度的重复元素下标
'''
def get_the_max_length_item(list,indexlist):
    max_num = indexlist[0]
    for num in indexlist:
        if(len(list[num])>len(list[max_num])):
            max_num = num;
    return max_num


#获取扩展程序总列表
total_crx_file = open("./crx_list.txt")
total_lines = total_crx_file.readlines()
total_crx = []
print('starting to remove the duplicate log....')
for total_line in total_lines:
    total_crx.append(total_line)
print('finish',len(total_crx))


#获取当前捕获的扩展程序指纹列表，其中可能存在重复
f = open("../output/fingerprint.csv")  # 返回一个文件对象
lines = f.readlines()  # 调用文件的 readline()方法
detected_list = []
detected_fin=[]
for line in lines:
    detected_fin.append(line)
    detected_list.append(line[7:39])

#该列表存放去重后的指纹记录
result_list = []
length =len(total_crx)
count = 0
for item in total_crx:
    if item.strip('\n') in detected_list:
        count += 1
        index = [i for i,x in enumerate(detected_list) if x==item.strip('\n')]
        num = get_the_max_length_item(detected_list, index)
        result_list.append(detected_fin[num])

final = open("../output/fingerprint.csv", "wa+")
for entry in result_list:
    final.write(entry)
final.close()
print("you have finished this operateion,you have ",length-count+1,"extensions not tested in total")