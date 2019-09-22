import React, { Component } from 'react';
import { createFilter } from '../util/Filter';
import { createSorter } from '../util/Sort';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextField from '@material-ui/core/TextField';

const styles = {
    orderControl:{
        
        
    },
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 15,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        width: '100%',
        height:40,
        padding: '0 30px',
        bottom:5,
    },
    textField: {
        //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,        
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        width: '20%',
        textAlign: "center",
        height:40,
        padding: '0 30px',        
    },
    input: {
      display: 'none',
    },
};

class Shopping extends Component{
        
    //init parameter for filter and sorter
    static defaultProps = {
        filters: [{
          property: 'name',
          value: 'Breakfast'
        }],
    
        sorters: [ {
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
            itemsPerPage: 30          
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
        fetch("/menu.txt")
          .then(res => res.json())
          .then(this.onLoad);
      }
    
    // sorting and filtering data
    parseData (data) {
        const { sorters } = this.state;
        const { filters } = this.state; 
        
        //sort data
        if (data && data.length) {
          if (Array.isArray(sorters) && sorters.length) {
            data.sort(createSorter(...sorters));
          }
        }
        
         //filter data
         if (Array.isArray(filters) && filters.length) {
            data = data.filter(createFilter(...filters));
        }

        return data;
    }
        
    onLoad = (data) => {
        this.setState({
          data: data
        });
        console.log(data);
    }
        
    render() {
        const { data } = this.state;    
        return data ? this.renderData(data) : this.renderLoading();
    }
    
    renderData(data) {
        const { currentPage, itemsPerPage } = this.state; 
        
        const { classes } = this.props;

        if (data && data.length > 0) {           
            
            // Get data for current page
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
            
            // Bind data to controls
            let productList = currentItems.map((categories)=>{
                let category_name = categories.name;
                let category_note = categories.note;
                let menuList = categories.menuitems.map((menu)=>{
                    return(                                                                  
                        <Grid item key={menu.id} >
                            <Card raised className="item-main-card">                                                           
                                <CardMedia  className="item-img"          
                                    component="img"                                                                                                       
                                    image="https://source.unsplash.com/random/900×700/?noodle"
                                    alt={menu.name}
                                />          

                                <CardContent>                                    
                                    <Typography variant="body1" component="p">
                                        <b>{category_name}</b>
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        <b>{menu.name}</b>
                                    </Typography>
                                    <Typography variant="body1" color="textPrimary" component="p">          
                                        {menu.description}  
                                    </Typography>   
                                    <Typography variant="body1" color="textPrimary" component="p">          
                                        <b>Price: {menu.price} </b>  
                                    </Typography>  
                                    
                                    <Typography variant="body1" color="textPrimary" component="p">          
                                        <i>Note: {category_note} </i>  
                                    </Typography>                                                                                                                                                                             
                                </CardContent>   
                                <CardActions>
                                    <Button className={classes.button}>
                                        Add to cart
                                    </Button>  
                                </CardActions>                             
                            </Card>
                        </Grid>                                                                                                  
                    )
                })
                return menuList;                                                    
            })

                 // building page numbers
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
                    pageNumbers.push(i);
                }                
        
                return(
                    <Container maxWidth="lg" component="main" >
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Today's menu:
                        </Typography>
                        <Grid container spacing={5} justify="center" alignItems="center">
                            {productList}
                        </Grid>   
                        <Grid item xs={12} >
                            <Paper>
                            <Grid container justify="center" alignItems="center">
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

Shopping.propTypes = {
    classes: PropTypes.object.isRequired
  };
  

export default withStyles(styles)(Shopping);