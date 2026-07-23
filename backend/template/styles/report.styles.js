export const reportStyles = `
<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial,Helvetica,sans-serif;
    color:#1f2937;
    padding:35px;
    background:white;
    font-size:14px;
}

.header{
    text-align:center;
    margin-bottom:35px;
}

.header h1{
    font-size:28px;
    color:#1e3a8a;
    margin-bottom:10px;
}

.header p{
    margin:4px 0;
    color:#4b5563;
}

.section-title{
    font-size:18px;
    margin:30px 0 12px;
    color:#1e3a8a;
    border-bottom:2px solid #1e3a8a;
    padding-bottom:6px;
}

.info-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:10px 30px;
    margin-bottom:30px;
}

.info-item{
    display:flex;
}

.info-item strong{
    width:140px;
}

.summary{
    margin-top:25px;
}

.footer{
    margin-top:40px;
    border-top:1px solid #ccc;
    padding-top:10px;
    text-align:center;
    color:#6b7280;
    font-size:12px;
}

</style>
`;