#!/bin/bash
# This script makes a backup of the WHOLE current folder (including subfolders) to a sibling folder, ending with the date:
#  i.e.  /Projects/my-project/...   ==>   /Projects/my-project-20170102-version1/...
# 
# If the destination folder already exists, it will create a new number, 20170102-version2/... and 20170102-version3/...  and so on.
#
# This by the way, is my first Bash script!
#

# define the variables
export NUMstart="1"
export NUMend="20"
export NUMexists="4"
export i=${NUMstart}
export TODAY=$(date +%Y%m%d)
export HOST=$(hostname)
export HOMEFOLDER=$HOME
export NEWFOLDERbase=$PWD"/"$TODAY"-versionX/"

# startup stuffies
clear
echo ""
echo "Starting backup ..."
echo ""
echo "   This will perform a backup from the current folder: "
echo "     " $PWD/ 
echo " "
echo "   It will be copied to ( max X = " $NUMend ") : " 
echo "     " $NEWFOLDERbase 
echo " "

# Now ask permission - must ENTER y to continue
echo "   Do you want to continue (y/n) and hit ENTER ? "
read responsez
if [ "$responsez" != "y" ]; then echo "Did not enter y -->  NO BACKUP DONE !!!"; exit; fi

# Loop on i, and stop at the first folder ...versionX that does not exist.  Remember its name
while [ $i -lt ${NUMend} ]
	do
	#	echo Working on extension $i ...
		export NEWFOLDERbase=$PWD"-"$TODAY"-version"$i"/"
		if [ ! -d "$NEWFOLDERbase" ]; then echo "The first backup folder number that does not exist is: " $i; break; fi
		echo Folder is $NEWFOLDERbase
	#	if [ "$i" -gt "$NUMexists" ]; then echo "The last backup nr found was > than the existing number, which is ${NUMexists}"; break; fi
		i=$[$i+1]
	done 

# This is the end: we have the first non-existant folder (versionX), and will backup to it ...
echo ""
echo "Backing current folder up to : " $NEWFOLDERbase
echo ""
eval "cp -a "  $PWD"/ " $NEWFOLDERbase
echo " "
echo "Successful !"
