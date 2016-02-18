import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Badge from 'material-ui/lib/badge';

export default class Mertic extends Component {
    render() {
        const { importance, urgency, difficulty } = this.props
        const style = this.constructor.style
        return (
                <span className="item-show-right">
                    <Badge
                        badgeContent={ importance }
                        className='item-show-right-star'
                        style={ style.badgeRoot }
                        badgeStyle={{...style.badge, 'backgroundColor':'rgba(243, 255, 66, 0.56)'}} 
                    >
                        重要
                    </Badge>
                    <Badge
                        badgeContent={ urgency }
                        className='item-show-right-star'
                        style={ style.badgeRoot }
                        badgeStyle={{...style.badge, 'backgroundColor':'rgba(244, 67, 54, 0.56)'}} 
                    >
                        紧急
                    </Badge>
                    <Badge
                        badgeContent={ difficulty }
                        className='item-show-right-star'
                        style={ style.badgeRoot }
                        badgeStyle={{...style.badge, 'backgroundColor':'rgba(3, 169, 244, 0.56)'}} 
                    >
                        困难
                    </Badge>
                </span>
)
    }
}

Mertic.propTypes = {
  importance: PropTypes.number.isRequired,
  urgency: PropTypes.number.isRequired,
  difficulty: PropTypes.number.isRequired,
}

Mertic.style = {
    badge: {
        fontSize: 15, 
        marginTop: '10px',
        width: '18px',
        height: '18px'
    },
    badgeRoot: {
        padding: "20px 18px 12px 0", 
    },
}
