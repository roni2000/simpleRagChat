export simpleChatVersion=$(grep "Version=" properties.ini | cut -d'=' -f2)
rm -f ./simpleragchat-amd64*.tar
docker buildx create --use
docker buildx build --platform linux/amd64 -t simpleragchat:$simpleChatVersion --output type=docker .
docker save -o simpleragchat-amd64-${simpleChatVersion#v}.tar simpleragchat:$simpleChatVersion