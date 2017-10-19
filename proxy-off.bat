git.exe config --unset http.proxy
git.exe config --global --unset http.proxy
git.exe config --get http.proxy
git.exe config --global --get http.proxy

call npm config rm proxy
call npm config rm https-proxy
call npm config list
