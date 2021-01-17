# coding:utf-8
import os
import shutil



#This script is used to filter out the list of undetected extensions
#该脚本用于将因特殊原因没有检测成功的扩展程序记录在指定txt文件中，并将其crx文件移动到指定文件夹进行之后的补充测试。


def pointIndex2zero(list,index_list):
    for num in index_list:
        list[num]=0
    return list

def returnNonZeroList(list):
    result= []
    for item in list:
        if(item!=0):
            result.append(item)
    return result


current_path = os.getcwd()
config_file = open(os.path.join(current_path, "config.txt"),"r")
lines = config_file.readlines()
temp = []
for line in lines:
    temp.append(line)

#该变量改为当前存放测试crx文件的路径
rootdir=temp[0].strip('\n')
#存储未测试成功扩展程序名称的txt文件路径
undetected_txt=temp[1].strip('\n')
undetected_list=open(undetected_txt,"a")
#存储未测试成功扩展程序crx文件的文件夹路径
undetected_crx_dir=temp[2].strip('\n')


detected_file= open("/Users/liuqiange/ChromeEXT/output/fingerprint.csv")  # 返回一个文件对象
lines = detected_file.readlines()  # 调用文件的 readline()方法


#目标测试文件列表
print("start loading target testing crx dir")
target_crx = []
target_filelist = []

for f in target_filelist:
    if (f[-3:] == 'crx'):
        target_crx.append(f[:-4])
print("finish loading",len(target_crx))

result = []
for line in lines:
    if line[7:39] in target_crx:
        index_list = [i for i, j in enumerate(target_crx) if j ==line[7:39]]
        target_crx = pointIndex2zero(target_crx,index_list)
    if(len(returnNonZeroList(target_crx))==0):
        break

result = returnNonZeroList(target_crx)


if len(result)>0:
    for crx in result:
        undetected_list.write("{}\n".format(crx))
        src_file = rootdir+"/"+crx+".crx"
        des_file = undetected_crx_dir+'/'+crx+".crx"
        shutil.copyfile(src_file,des_file)
    print(len(result),"crxs not test in total")
    print(result)
else:
    print("all target crx tested finished")


print("finish processing!!!!")
