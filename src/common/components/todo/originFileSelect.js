import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import  Immutable from 'immutable'
import FlatButton from 'material-ui/lib/flat-button';
import { eFilename }  from '../../constants';

export default class OriginFileSelect extends Component {
    shouldComponentUpdate (nProps, nState) {
        if (Immutable.is(nProps.files, this.props.files)
           &&  Immutable.is(nProps.selects, this.props.selects)
           ){
               return false 
        }
        return true  
    }
    handleClickFile(file, toSelect) {
       let sf = file
       if ( file.text === eFilename.browser )  {
            sf.text  =  '' 
       }
       this.props.actions.toggleSelectFile( sf , toSelect)  
    }

    getStyle (){
        return this.constructor.style
    } 
    render() {
        const { files, selects } = this.props
        const style = this.getStyle() 
        return (

            <div  className="fromfiles">
                { files.map((file) => {
                        let select = selects.some(sf => sf.text === file.text ) 
                        let filename = file.text === '' ? eFilename.browser : file.text 
                        const fileButStyle = Object.assign( {}, style.fileBut,  { color: select ?  '#28BAAD' :  '#262626' })
                        return (
                                <span 
                                    className='tagBadge' 
                                    key={ file.id + 1 }
                                    style={fileButStyle}
                                    onClick={ e =>  this.handleClickFile( file, !select) }
                                > 
                                    { filename }
                                </span>
                        )
                    }) 
               }
            </div>
        ) 
    }
}

OriginFileSelect.propTypes = {
    files: React.PropTypes.instanceOf(Immutable.List),
    selects: React.PropTypes.instanceOf(Immutable.List),
    actions: PropTypes.object.isRequired,
}

OriginFileSelect.style = {
    fileBut: {
        background:  "whitesmoke" ,
        borderColor: '#262626',
        padding: '.4em .8em .4em .8em',
        borderRadius: '18px',
        cursor: 'pointer',
    },
}

