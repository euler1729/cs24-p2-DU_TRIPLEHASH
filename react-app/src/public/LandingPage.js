import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


//Images
import carousel_image1 from './res/carousel_image1.png';
import carousel_image2 from './res/carousel_image2.png';

// Brand
import LogGif from '../EcoSyncBrand/logogif.gif'
import EcoBrand from '../EcoSyncBrand/EcoSyncBrand.json'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(4),
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: EcoBrand.Colors.green,
        marginBottom: theme.spacing(2),
    },
    description: {
        fontSize: '1.2rem',
        color: theme.palette.text.secondary,
    },
    sliderContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slider: {
        width: '70%',
    },
}));

function LandingPage() {
    const classes = useStyles();
    const cookies = new Cookies();

    // Configuration for the slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };



    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <img src={LogGif} alt="EcoSync Logo" style={{ width: '200px' }} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h2" align="center" className={classes.title}>
                        EcoSync: Revolutionizing Waste Management
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" align="center" className={classes.description}>
                        Welcome to EcoSync, your solution for efficient waste management in Dhaka North City Corporation.
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" href="/about">
                        Learn More
                    </Button>
                    {!cookies.get('access_token') && <Button variant="contained" color="secondary" href="/login" style={{ marginLeft: 10, fontWeight:'bold' }}>
                        Login
                    </Button>}
                </Grid>
                <Grid item xs={12} className={classes.sliderContainer}>
                    <div className={classes.slider}>
                        <Slider {...settings}>
                            <div>
                                <img src={carousel_image1} alt="Carousel 1" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <img src={carousel_image2} alt="Carousel 2" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <img src={carousel_image1} alt="Carousel 3" style={{ width: '100%' }} />
                            </div>
                        </Slider>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default LandingPage;
