git.exe config http.proxy proxy:3128
git.exe config --global http.proxy proxy:3128
git.exe config --get http.proxy
git.exe config --global --get http.proxy

call npm config set proxy http://proxy-internet.localnet:3128/
call npm config set https-proxy http://proxy-internet.localnet:3128/
call npm config list
