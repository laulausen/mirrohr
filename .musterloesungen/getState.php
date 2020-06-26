<?php

$con = mysqli_connect('localhost','benutzer','password','DBName');
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

$sql="select wert from Flags where name like 'bewegung';";

$result = mysqli_query($con,$sql);

while($row = mysqli_fetch_array($result)) {
    echo "".$row['wert'];
}

mysqli_close($con);

?>
