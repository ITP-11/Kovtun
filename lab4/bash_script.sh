#!/bin/bash

i=0
while [ "$i" != 5 ]; do

clear
echo '1. about author'
echo '2. formula'
echo '3. check folder'
echo '4. create archives'
echo '5. quit'

read i 
if [ "$i" == 1 ]
then
	echo 'Andrei Kovtun, ITP-11'
elif [ "$i" == 2 ]
then
	echo 'enter pc number'
	read n_pc
	echo 'enter your number in journal'
	read n_j
	echo 'enter your age'
	read n_age
	x=$((($n_pc+$n_j)*$n_age))
	echo "x=$x"	
elif [ "$i" == 3 ]
then
	echo 'enter folder name'
	read foldername
	if [ -d "./$foldername" ]
	then
			echo 'folder true!'
	else 
		mkdir $foldername
		echo 'folder created'
	fi

elif [ "$i" == 4 ]
then
	echo 'enter path'
	read folderpatch
	cd "$folderpatch"
	for f in `ls`;
	do
		if [ ${f: -4} == ".tgz" ]
		then
			rm -f "$f"
		fi
	done
	for file in `ls`;
	do
		tar -czf "$file.tgz" "$file"
	done
	cd ~	
elif [ "$i" == 5 ]
then
	echo 'closing...'
	fi
read key

done
