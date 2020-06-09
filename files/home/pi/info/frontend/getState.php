<?php

$con = mysqli_connect('localhost','user','password','db');
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

$sql="";

$result = mysqli_query($con,$sql);

while($row = mysqli_fetch_array($result)) {
    echo "".$row['wert'];
}

mysqli_close($con);

?>
 
        on(W.millisek=MhT.Wert_millisek) 
        join mirrohr.Messung as M 
        on(M.idMessung=MhT.Messung_idMessung) 
        where (idMessung = 1);";
$result = mysqli_query($con,$sql);
while($row = mysqli_fetch_array($result)) {
    echo "".$row['wert'];
}
mysqli_close($con);
?>
