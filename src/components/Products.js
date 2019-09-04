import React, { Component } from 'react';
import { createFilter } from '../util/Filter';
import { createSorter } from '../util/Sort';

class Products extends Component{
    static defaultProps = {
        filters: [{
          property: 'Category',
          value: 'fruit baskets'
        }],
    
        sorters: [{
          property: 'Brand'
        }, {
          property: 'Name'
        }]
    }

    constructor(props) {
        super(props);
        this.state = {          
            data:[],
            filters: this.props.filters,
            sorters: this.props.sorters,
            currentPage: 1,
            itemsPerPage: 99          
        };   
        this.handleClick = this.handleClick.bind(this);     
    }   
    
    handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }
    
    componentDidMount () {
        fetch("/data/store-data.json")
          .then(res => res.json())
          .then(this.onLoad);
      }
    
    parseData (data) {
        const { sorters } = this.state;
        const { filters } = this.state;

        if (data && data.length) {
          if (Array.isArray(sorters) && sorters.length) {
            data.sort(createSorter(...sorters));
          }
        }
        
        if (Array.isArray(filters) && filters.length) {
          data = data.filter(createFilter(...filters));
        }
    
        return data;
      }
    
    onLoad = (data) => {
        this.setState({
          data: this.parseData(data.data)
        });
    }
        
    render() {
        const { data } = this.state;    
        return data ? this.renderData(data) : this.renderLoading();
    }
    
    renderData(data) {
        const { currentPage, itemsPerPage } = this.state;
        if (data && data.length > 0) {
            // Logic for displaying page
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
            
            let productList = currentItems.map((product,index)=>{
                let productImage = product.ImageLinks.filter(image => image.Rel === "large"); 
                let productImageUri = productImage[0].Uri;    
                let productSaleDateText;
                if (product.Sale){
                    productSaleDateText = product.Sale.DateText;
                }
                let productPercentOff ;
                if(product.RegularPrice && product.RegularPrice.length>0){
                    let RegularPrice = product.RegularPrice.replace('$','');
                    let CurrentPrice = product.CurrentPrice.replace('$','');
                    if (!isNaN(CurrentPrice)){
                        productPercentOff = 100-Math.floor((CurrentPrice/RegularPrice)*100);                    
                    }                        
                }
                if (productPercentOff){
                    productPercentOff = productPercentOff + '% Off';
                }                         
                return(           
                    <div className="card" key={index}>
                        <div className="card-image">
                            <img className="image" src={productImageUri} alt={product.Name}/>                                                                                                              
                        </div>
        
                        <div className="card-content">                          
                            <span className="card-title">{product.Name}</span>      
                            <p>{product.Brand}</p>                            
                            <p>{product.Description}</p>
                            <p>{product.Size}</p>
                            <p><b>Reg {product.RegularPrice}</b></p>
                            <span className="card-sale">Sale {product.CurrentPrice}</span><br/>
                            <span className="card-sale">{productPercentOff}</span>                        
                            <p>{productSaleDateText}</p>                            
                        </div>
                    </div>               
                    )
                })

                 // Logic for displaying page numbers
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
                    pageNumbers.push(i);
                }
    
                const renderPageNumbers = pageNumbers.map(number => {
                    let activePageClass =(currentPage==number)? 'page-active':'';                        
                    return (                        
                        <li
                            key={number}
                            id={number}
                            className={activePageClass}
                            onClick={this.handleClick}
                        >
                            {number}
                        </li>
                    );
                });
        
                return(
                    <div className="container">                
                        <div className="box">
                            {productList}
                        </div>
                        <div >
                            <ul className="pagination">
                                {renderPageNumbers}
                            </ul>                            
                        </div>
                    </div>
                )               
    
        } else {
          return <div>No items found</div>;
        }
      }
    
    renderLoading() {
        return <div>Loading...</div>;
    }            
}    


export default Products 