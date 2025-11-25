export pmAdminVer=$(grep "Version=" properties.ini | cut -d'=' -f2)
rm -f ./pmadmin-amd64*.tar
docker buildx create --use
docker buildx build --platform linux/amd64 -t pmadmin:$pmAdminVer --output type=docker .
docker save -o pmadmin-amd64-${pmAdminVer#v}.tar pmadmin:$pmAdminVer