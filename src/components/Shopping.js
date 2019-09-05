import React, { Component } from 'react';
import { createFilter } from '../util/Filter';
import { createSorter } from '../util/Sort';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';

class Shopping extends Component{
    
    //init parameter for filter and sorter
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
    
    //page number click event
    handleClick(event) {
        this.setState({          
          currentPage: Number(event.target.value)
        });
    }
    
    // fetch data from json file
    componentDidMount () {
        fetch("/data/store-data.json")
          .then(res => res.json())
          .then(this.onLoad);
      }
    
    // sorting and filtering data
    parseData (data) {
        const { sorters } = this.state;
        

        //sort data
        if (data && data.length) {
          if (Array.isArray(sorters) && sorters.length) {
            data.sort(createSorter(...sorters));
          }
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
        const { filters } = this.state;        

        if (data && data.length > 0) {
            //filter data
            if (Array.isArray(filters) && filters.length) {
                data = data.filter(createFilter(...filters));
            }
            
            // Get data for current page
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
            
            // Bind data to controls
            let productList = currentItems.map((product,index)=>{
                let productImage = product.ImageLinks.filter(image => image.Rel === "thumbnail"); 
                let productImageUri = productImage[0].Uri;    
                let productSaleDateText;
                if (product.Sale){
                    productSaleDateText = product.Sale.DateText;
                }

                // Calculating sale off percent
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
                        <Grid item key={index} xs={12} sm={4} >
                            <Card raised className="item-main-card">
                                <CardMedia  className="item-img"          
                                    component="img"                                                                                                       
                                    image={productImageUri}
                                    title={product.Name}
                                />                                
                                <CardContent>                                    
                                    <Typography variant="body1" component="p">
                                        <b>{product.Name}</b>
                                    </Typography>
                                    <Typography variant="body1" color="textPrimary" component="p">          
                                        {product.Brand}  
                                    </Typography>                                                                                            
                                    <Typography variant="body1" color="textPrimary" component="p">          
                                        {product.Description}
                                    </Typography>      
                                    <Typography variant="body1" color="textPrimary" component="p">          
                                        {product.Size}  
                                    </Typography> 
                                    <Typography variant="body1" color="textPrimary" component="p">          
                                        <b>Reg {product.RegularPrice}</b> 
                                    </Typography>
                                    <Typography variant="body1" className="item-onsale" component="p">          
                                        <b>Sale {product.CurrentPrice}</b>
                                    </Typography>
                                    <Typography variant="body1" className="item-onsale" component="p">          
                                        <b>{productPercentOff}</b>  
                                    </Typography>
                                    <Typography variant="body2" color="textPrimary" component="p">          
                                        {productSaleDateText}  
                                    </Typography>                                                                                                                                                                                                   
                                </CardContent>                                
                            </Card>
                        </Grid>                                                                                                  
                    )
                })

                 // building page numbers
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
                    pageNumbers.push(i);
                }                
        
                return(
                    <Container maxWidth="md" component="main">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Today's best deals:
                        </Typography>
                        <Grid container spacing={5} alignItems="stretch">
                            {productList}
                        </Grid>   
                        <Grid item xs={12} alignItems="center">
                            <Paper>
                            <Grid container >
                                <Grid item>                                
                                    <RadioGroup
                                        name="spacing"
                                        aria-label="spacing" 
                                        alignItems="center" 
                                        value={currentPage.toString()}                                  
                                        onChange={this.handleClick}
                                        row
                                    >
                                    {pageNumbers.map(value => (
                                    <FormControlLabel
                                        key={value}
                                        value={value.toString()}
                                        control={<Radio />}
                                        label={value.toString()}
                                    />
                                    ))}
                                </RadioGroup>
                                </Grid>
                            </Grid>
                            </Paper>
                        </Grid>                     
                    </Container>                    
                )               
        } else {
          return <div>No items found</div>;
        }
      }
    
    renderLoading() {
        return <div>Loading...</div>;
    }            
}    

export default (Shopping);