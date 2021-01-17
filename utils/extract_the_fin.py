# !/usr/bin/python
# -*- coding: UTF-8 -*-
import os
current_path = os.getcwd()
f = open(os.path.join("../output/fingerprint.csv"))
lines = f.readlines()  # 调用文件的 readline()方法

print("your output extension fingerprint will be seved at file path :")
output_file = os.path.join(current_path,"../","output/fin_set.txt")
print(output_file)
final_file = open(output_file, "wa+")

for line in lines:
    if(len(line.strip('\n'))!=62):
        final_file.write("{}\n".format(line.strip('\n')))
final_file.close()
print("extract operation has done!");
