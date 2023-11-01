class ProductManager{
    constructor(){
        this.productos=[];
        this.nextId=1;
    }
    addProduct(title,description,price,thumbnail,code,stock){
        if((!this.productos.find((p)=>p.code==code))&&(title&&description&&price&&thumbnail&&code&&stock)){
            this.productos.push({
                id:this.nextId++,
                title:title,
                description:description,
                price:price,
                thumbnail:thumbnail,
                code:code,
                stock:stock
            })
        }else{
            console.log("Todos los campos ingresados son obligatorios y el codigo no se debe repetir");
        };
    }
    getProducts(){
        return console.log(this.productos);
    }
    getProductById(id){
        const productoId=this.productos.find((p)=>p.id==id)
        if(productoId){
            return console.log(productoId);
        }else{
            return console.log("Not found");
        }
    }
}

const productos=new ProductManager();
productos.addProduct('producto1','descripcion1',10,'url1',1244,22);
productos.addProduct('producto2','descripcion3',14,'url3',1255,25);
productos.addProduct('producto3','descripcion2',13,'url2',1244,20);//codigo repetido
productos.addProduct('producto4','',16,'',1299,21);//faltan datos
productos.getProducts();//Todos los productos,debe mostrar 2 productos
productos.getProductById(1);//Producto con id 1
productos.getProductById(3);//Not found