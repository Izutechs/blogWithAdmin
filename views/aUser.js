<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Izutechs | <%=title  %> </title>
    <link href="../css/blogStyles.css" rel="stylesheet">
    <link href="../css/profile.css" rel="stylesheet">
</head>
<body>
    <h1><a href="/" class="sitetxt">Izutechs</a></h1>

   
    
   
       <%-include("./partials/navbar.ejs")%>

  <div class="admin"></div>
   <%    if(signedUser){%>
           

           
            <span><%=signedUser.username%></span><br>
            <span><%=signedUser.email%></span><br>
            <span><a href="/cp/admin/aUser/blogs/<%=signedUser.unique_id%>">POSTS</a></span><br>
           
       
            <%    }%>
      
    
    
<br>

<%-include("./partials/footer.ejs")%>
</script>
</body>
</html>
     
