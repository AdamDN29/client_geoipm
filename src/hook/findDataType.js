const dataType = [ 
    {title:"ipm", text:"Indeks Pembangunan Manusia"}, 
    {title:"uhh", text:"Umur Harapan Hidup"}, 
    {title:"ahls", text:"Angka Harapan Lama Sekolah"}, 
    {title:"arls", text:"Angka Rata-Rata Lama Sekolah"}, 
    {title:"ppd", text:"Pendapatan PerKapita Disesuaikan"}, 
    {title:"iuhh", text:"Indeks Umur Harapan Hidup"}, 
    {title:"ipthn", text:"Indeks Pengetahuan"}, 
    {title:"iplrn", text:"Indeks Pengeluaran"}, 
    {title:"intercept", text:"Intercept"}, 
]

function findDataType( title) {
    return dataType.find((element) => {
        return element.title === title
    })
}

export default findDataType;