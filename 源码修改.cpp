/*------------------Print调试方法---------------------*/
{(折叠)
// 使用 --enable-logging=stderr 参数以伴随调试输出信息启动chrome
// （不要追加 --v=1参数，否则会产生大量 INFO 级别的信息淹没输出）
// 可使用的调试级别有 
//   * LOG(WARNING)
//   * LOG(ERROR)
//   * DVLOG(0)
// 等，直接使用LOG(INFO)的信息不会显示


// 在一个源文件中启用调试功能需要首先添加头文件
#ifndef BASE_LOGGING_H_
#include "/base/logging.h"
#endif


// 随后即可使用上述三种函数及重载的<<运算符。示例：
// src\content\app\content_main_runner_impl.cc中890行的
ContentMainRunnerImpl::RunBrowser 
// 函数是Chromium 的入口点。从896行添加：
char hi[] = "hello world";
DVLOG(0) << "I say: " << hi;

// 保存后使用ninja增量编译（不需重新gn），重新运行chromium，
// 我们的自定义调试信息就会被输出在第一行：
[14964:5792:1207/112904.301:INFO:content_main_runner_impl.cc(898)] 
I say: hello world
}

/*----------------Chromium源代码修改------------------*/
【\chrome\browser\extensions\extension_service.cc】
// 此文件中完成拓展的批量静默安装
{(折叠)
① 首先添加头文件:
#include "extensions/common/file_util.h"
#include "chrome/browser/ui/toolbar/toolbar_actions_model.h"
#include "extensions/browser/extension_registrar.h"
#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <io.h>

② 在初始化ExtensionService类后，静默安装指定路径下的拓展：
void ExtensionService::Init()函数末尾，添加
  /*----------------Add by jw START----------------*/
  VLOG(0) << "Installed Extensions: " << 
    registry_->GenerateInstalledExtensionsSet()->size();
  VLOG(0) << "Install Dir: " << install_directory_;
  
  // Read CRX path from config file
  std::string str;
  std::string crx_path;
  std::ifstream f("config.txt");
  if (!f) {
    VLOG(0) << std::endl << "Config File not found." << std::endl;
    return;
  }
  while (getline(f, str)) {
    std::string::size_type n;
    if((n = str.find("=")) != std::string::npos) {
      if (str.substr(0, n) == "crxpath") {
        crx_path = str.substr(n + 1);
        VLOG(0) << "\n--------------------" 
                << "CRX Folder Path: " << crx_path;
        break;  
      }
    }
  }
  
  // List dir
  std::vector<std::string> crx_files;
  struct _finddata_t fileinfo;
  std::string _expand_crx_path = crx_path + "*.crx";
  intptr_t handle = _findfirst(_expand_crx_path.c_str(), &fileinfo);
  if(handle == -1) {
    VLOG(0) << "\n--------------------" 
            << crx_path << " is empty!";
    return;
  }
  
  do {
    crx_files.push_back(fileinfo.name);
  } while (_findnext(handle, &fileinfo) == 0);
  
  _findclose(handle);
  
  for (const std::string& crx : crx_files) {
    // Read A CRX File
    VLOG(0) << "\n[INSTALL 1]--------------------"
            << "Now Loading: " << crx;
    std::string id = crx.substr(0, 32);
    
    // Pass the crx path to crxfileinfo
    std::string _crx_file = crx_path + crx;
    char _crx_file_char[1024];
    strcpy(_crx_file_char, _crx_file.c_str());
    base::FilePath::CharType filename[1024];
    
    int nLen = MultiByteToWideChar(CP_ACP, MB_PRECOMPOSED, _crx_file_char, -1, NULL, 0);
    wchar_t* pResult = new wchar_t[nLen];  
    MultiByteToWideChar(CP_ACP, MB_PRECOMPOSED, _crx_file_char, -1, pResult, nLen);  
    base::wcslcpy(filename, pResult, base::size(filename));
    
    const base::FilePath file_path(filename);
    CRXFileInfo file_info(file_path, GetExternalVerifierFormat());
  
    // Install if not installed
    const Extension* extension = registry_->GetExtensionById(
      id, ExtensionRegistry::EVERYTHING);
    if (extension) {
        VLOG(0) << id << "already exists. Skip.\n"
        << "dis: " << registry_->disabled_extensions().Contains(id) << "\n"
        << "tem: " << registry_->terminated_extensions().Contains(id) << "\n"
        << "blk: " << registry_->blocked_extensions().Contains(id) << "\n"
        << "bll: " << registry_->blocklisted_extensions().Contains(id);
    } else {
      // Silent install
      scoped_refptr<CrxInstaller> installer(CrxInstaller::CreateSilent(this));
      installer->set_install_cause(extension_misc::INSTALL_CAUSE_EXTERNAL_FILE);
      installer->set_expected_id(id);
      installer->set_install_immediately(true);
      installer->set_grant_permissions(true);
      installer->InstallCrxFile(file_info); // Enable the extension in InstallCrxFile
  
      // Suppress the notification
      external_install_manager_->AcknowledgeExternalExtension(id);
      VLOG(0) << "\n[INSTALL 2]--------------------"
              << "Extension: " << id << " installing...";
    }
  }
  /*----------------Add by jw END----------------*/

其中，config.txt是与chrome.exe放置在同一目录的配置文件，指定要批量安装测试
的CRX文件夹路径，内容为
//--------------config.txt---------------
# Do not add any spaces in a single line

# The path of the folder which holds the crx files to be tested
crxpath=C:/Users/DaweiX/Desktop/Web/crx/

# The uuid of AutoTester
autotester_id=jobmhdjcfeppgkggmdapaakjlkdcpmcc
//-----------End of the file-------------
}

【\chrome\browser\extensions\crx_installer.cc】
// 此文件中完成对前述静默安装的拓展的权限授予，否则拓展无法正常工作
{(折叠)
① 修改默认构造函数：
CrxInstaller::CrxInstaller中的初始化列表中，修改allow_silent_install_值为 true
注意，不能修改approved_的值，否则会造成chrome运行时崩溃

② 添加代码：
void CrxInstaller::ReportSuccessFromUIThread()函数中，
if (!update_from_settings_page_) 作用域结尾，添加

  /*----------------Add by jw and qg START----------------*/
  ExtensionService* service = service_weak_.get();
  
  ScriptingPermissionsModifier modifier(profile(), extension());
  modifier.GrantHostPermission(GURL("http://localhost:3000"));
  if(!modifier.HasGrantedHostPermission(GURL("http://localhost:3000"))){
    VLOG(0) << extension()->id() << " grant permission on honeysite fail";
  }
  
  service->GrantPermissions(extension());
  service->DisableExtension(extension()->id(), disable_reason::DISABLE_USER_ACTION);
  VLOG(0) << "\n[INSTALL 3]--------------------"
          << "Extension " << extension()->id() << " installed!";
  /*----------------Add by jw and qg END----------------*/
  
}

③ 追加头文件：
/*-----------add------------*/
#ifndef BASE_LOGGING_H_
#include "/base/logging.h"
#endif
#include "chrome/browser/extensions/scripting_permissions_modifier.h"

【\chrome\browser\extensions\extension_tab_util.cc】
bool ExtensionTabUtil::OpenOptionsPageFromAPI 函数，直接 return false


【\chrome\browser\extensions\api\web_navigation\web_navigation_api_helpers.cc】
// （重要！！！）此处完成拓展的自动激活
{(折叠)
① 添加头文件：
#include "chrome/browser/extensions/extension_action_runner.h"
#include "extensions/browser/extension_action_manager.h"
#include "chrome/browser/ui/browser_finder.h"
#include "base/run_loop.h"
#ifndef BASE_LOGGING_H_
#include "/base/logging.h"
#endif
#include "chrome/browser/extensions/tab_helper.h"
#include "chrome/browser/extensions/api/extension_action/extension_action_api.h"
#include <iostream>
#include <string>
#include <fstream>

② void DispatchOnCompleted函数末尾的
DispatchEvent(browser_context, std::move(event), url); 之前，插入
  /*------------------------------------------------------*/
  std::string str;
  std::string myid;
  std::ifstream f("config.txt");
  if (!f) {
    VLOG(0) << std::endl << "Config File not found." << std::endl;
    return;
  }
  while (getline(f, str)) {
    std::string::size_type n;
    if((n = str.find("=")) != std::string::npos) {
      if (str.substr(0, n) == "autotester_id") {
        myid = str.substr(n + 1);
        VLOG(0) << "\n--------------------" 
                << "Autotester id: " << myid;
        break;  
      }
    }
  }
  
  ExtensionRegistry* registry_ = ExtensionRegistry::Get(browser_context);
  for (const auto& extension : registry_->enabled_extensions()) { 
    if (extension->id() == myid) continue;
    
    extensions::ExtensionAction* extension_action =
      extensions::ExtensionActionManager::Get(browser_context)
        ->GetExtensionAction(*extension);
          
    if(!extension_action){VLOG(0)<<"no extension_action for" << extension->id();continue;}
    VLOG(0)<< "\n---------------------" << "Run: " << extension->id();
    extensions::ExtensionActionRunner* runner = 
      extensions::ExtensionActionRunner::GetForWebContents(web_contents);
    if(!runner){VLOG(0)<<"no runner";continue;}
    runner->RunAction(extension.get(), true);
  }
  /*------------------------------------------------------*/
}


【此条无需修改，此处仅作为记录】【\content\browser\log_console_message.cc】
// 此文件包含浏览器控制台输出的相关控制逻辑，负责将捕获的指纹输出到文件中
void LogConsoleMessage末尾，将message(honey site打印的指纹)同步输出到文件中.
若当前拓展没有记录到指纹，则在文件中追加一个空行.

【\extensions\browser\api\management\management_api.cc】
// 取消卸载拓展时弹出的确认窗口
将 show_confirm_dialog |= !self_uninstall; 改为 show_confirm_dialog = false; 即可