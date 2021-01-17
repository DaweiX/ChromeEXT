#!/usr/bin/python
# -*- coding: UTF-8 -*-
import os
import sys

if __name__ == "__main__":
    current_path = os.getcwd()
    config_file = os.path.join(current_path, "config.txt")
    '''
    示例参数
    "/Users/liuqiange/crx" //注意加引号
    "./undetected.txt"
    "/Users/liuqiange/ChromeEXT/Undetected_crx"
    '''
    if not os.path.exists(config_file):
        print("you have to set some enviroment variables")
        print("what you set will be saved in path:",config_file)

        f=open(config_file,"a")
        #该变量改为当前存放测试crx文件的路径
        rootdir= input("please input your rootfilepath")
        f.write("{}\n".format(rootdir))

        #存储未测试成功扩展程序名称的txt文件路径
        undetected_crx_list_txt=input("please input .txt filepath to save undetected extension namel list")
        f.write("{}\n".format(undetected_crx_list_txt))

        #存储未测试成功扩展程序crx文件的文件夹路径
        undetected_crx_dir=input("please input dirpath to save undetected extension crx file ")
        f.write("{}\n".format(undetected_crx_dir))

        f.close()
    else:
        if(sys.argv[1])=="check":
            from text_handler import *
        elif(sys.argv[1]=="dup"):
            from duplicate_removal import *
        elif(sys.argv[1]=="extract"):
            from extract_the_fin import *