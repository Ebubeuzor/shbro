export const styles = {
    chatWithMeButton: {
        cursor: 'pointer',
        boxShadow: '0px 0px 16px 6px rgba(0, 0, 0, 0.33)',
        // Border
        borderRadius: '50%',
        // Background 
        backgroundImage: `url(https://imagetolink.com/ib/GWS2AQy3uI.png)`, 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        // Size
        width: '84px',
        height: '84px',
    },
    avatarHello: { 
        // Position
        position: 'absolute', 
        left: 'calc(-100% - 44px - 28px)', 
        top: 'calc(50% - 24px)', 
        // Layering
        zIndex: '10000',
        boxShadow: '0px 0px 16px 6px rgba(0, 0, 0, 0.33)',
        // Border
        padding: '12px 12px 12px 16px',
        borderRadius: '24px', 
        // Color
        backgroundColor: '#f9f0ff',
        color: 'black',
    },
    supportWindow: {
     
   // Position
        // position: 'fixed',
        // bottom: '11px',
        // right: '24px',
        // // Size
        // width: '370px',
        // height: '570px',
        // maxWidth: 'calc(100% - 48px)',
        // maxHeight: 'calc(100% - 48px)',
        // backgroundColor: 'white',
        // // Border
        // borderRadius: '12px',
        // // border: `2px solid #7a39e0`,
        // overflow: 'hidden',
        // zIndex:'1000',

        // Shadow
        boxShadow: '0px 0px 16px 6px rgba(0, 0, 0, 0.33)',
    },
    emailFormWindow: { 
        width: '100%',  
        overflow: 'hidden',
        transition: "all 0.5s ease",
        WebkitTransition: "all 0.5s ease",
        MozTransition: "all 0.5s ease",
    },
    stripe2: {
        position: 'relative',
        top: '-45px',
        width: '100%',
        height: '338px',
        backgroundColor: 'rgb(30, 41, 59)',
        transform: 'skewY(-12deg)',
    },
    stripe: {
        position: 'relative',
        top: '-45px',
        width: '100%',
        height: '338px',
        backgroundColor: 'rgb(30, 41, 59)',
        transform: 'skewY(-12deg)',
    },
    topText: { 
        position: 'relative',
        width: '100%', 
        top: '15%', 
        color: 'white', 
        fontSize: '24px', 
        fontWeight: '600',
    },
    emailInput: { 
        width: '66%',
        textAlign: 'center',
        outline: 'none',
        padding: '12px',
        borderRadius: '12px',
        border: '2px solid rgb(251,146,60)',
        backgroundColor:"white",
    },
    bottomText: { 
        position: 'absolute', 
        width: '100%', 
        top: '60%', 
        // color: '#7a39e0', 
        fontSize: '19px', 
        fontWeight: '600' 
    },
    loadingDiv: { 
        position: 'absolute', 
        // height: '100%', 
        // width: '100%', 
        textAlign: 'center', 
        backgroundColor: 'white',
    },
    loadingIcon: { 
        color: 'rgb(251,146,60)' ,
        position: 'absolute', 
        top: 'calc(50% - 51px)', 
        left: 'calc(50% - 51px)',  
        fontWeight: '600',
    },
    chatEngineWindow: {
        width: '100%',  
        backgroundColor: '#fff',
        
    }
}
















