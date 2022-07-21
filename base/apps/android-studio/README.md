## For WSL

Add this lines in .bashrc/.zshrc file:

```
export WSL_HOST_IP=`grep nameserver /etc/resolv.conf | sed 's/nameserver //'`
export DISPLAY="$WSL_HOST_IP$DISPLAY" # Only DISPLAY is important, other variables are for clarity
```
