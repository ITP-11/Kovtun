dim s
set a = CreateObject("Scripting.FileSystemObject")


do
WScript.StdOut.WriteLine "******************"
WScript.StdOut.WriteLine "*menu:           *"
WScript.StdOut.WriteLine "******************"
WScript.StdOut.WriteLine "*1. About author *"
WScript.StdOut.WriteLine "*2. Create folder*"
WScript.StdOut.WriteLine "*3. Create txt   *"
WScript.StdOut.WriteLine "*4. Exit         *"
WScript.StdOut.WriteLine "******************"
WScript.StdOut.Write "Choose menu item: "

s = WScript.StdIn.ReadLine

Set WshShell = WScript.CreateObject("WScript.Shell")

if (s="1") Then
	WScript.StdOut.WriteLine "Koutun Andrei, ITP-11"
	WScript.StdOut.WriteLine "press 2 to enter name"
	WScript.StdOut.WriteLine "and path for new folder"
	WScript.StdOut.WriteLine "press 3 and enter name"
	WScript.StdOut.WriteLine "for new .txt file and"
	WScript.StdOut.WriteLine "enter text for this file"
elseif(s="2") Then
	WScript.StdOut.Write "Enter folder name:"
	f = WScript.StdIn.ReadLine
	WScript.StdOut.Write "Enter path: "
	z = WScript.StdIn.ReadLine
	a.CreateFolder(z+f)

elseif(s="3") Then
	WScript.StdOut.Write "Enter name: "
	z = WScript.StdIn.ReadLine
	WScript.StdOut.Write "Enter text: "
	f = WScript.StdIn.ReadLine
	set b = a.CreateTextFile(z+".txt")
	b.WriteLine(f)
End if
loop until (s="4") 