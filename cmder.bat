cmd /K "%ConEmuDir%\..\init.bat && \mongodb\bin\mongod" -new_console:b:n:d:"C:\mongodb\bin":h5000:s1TH:t:"mongod"
cmd /K "%ConEmuDir%\..\init.bat && npm run BoServer:dev" -new_console:b:n:d:"C:\workspace\mapTest":h5000:s2T80V:t:"BoServer:dev"
cmd /K "%ConEmuDir%\..\init.bat && npm run FoServer:dev" -new_console:b:n:d:"C:\workspace\mapTest":h5000:s3TV:t:"FoServer:dev"
