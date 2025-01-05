import subprocess
import time
bat_file_path = "bot.bat"  # 替换成你的批处理文件的路径

def run_bat_file(bat_file_path):
    process = subprocess.Popen(bat_file_path, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    while True:
        output = process.stdout.readline().decode().strip()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output)
            #将output写入日志文件
            #请自行 创建logs文件夹  以及  log.txt 文件
            with open('D:\HMCL\logs\log.txt', 'a', encoding='utf-8') as f:
                try:
                    timestamp = time.strftime("[%Y/%m/%d %H:%M]", time.localtime())
                    f.write(timestamp + output + '\n')
                    f.flush()
                except Exception as e:
                    print('写入日志文件失败')
            
            
            if output == 'CN':
                print('非正常退出，正在执行重启...')
                time.sleep(5)
                run_bat_file(bat_file_path)
            else:
                if output == 'DN':
                    break

if __name__ == "__main__":
    run_bat_file(bat_file_path)
