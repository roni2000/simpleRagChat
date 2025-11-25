export simpleChatVersion=$(grep "Version=" properties.ini | cut -d'=' -f2)
rm -f ./simpleChat-amd64*.tar
docker buildx create --use
docker buildx build --platform linux/amd64 -t simpleChat:$simpleChatVersion --output type=docker .
docker save -o simpleChat-amd64-${simpleChatVersion#v}.tar simpleChat:$simpleChatVersion