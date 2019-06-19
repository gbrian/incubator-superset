import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../../stylesheets/less/gridlist.less';

const src = 'https://react.semantic-ui.com/images/wireframe/white-image.png'

const propTypes = {
  /*itemId: PropTypes.number.isRequired,
  fetchFaveStar: PropTypes.func,
  saveFaveStar: PropTypes.func,
  isStarred: PropTypes.bool.isRequired,*/
};

export function pickColorClass(ix){
    if(ix >= paletteLen){
        ix = ix - (paletteLen * Math.floor(ix/paletteLen));
    }
    return 'median-cut-' + ix;
}

export function getImage(url){
    return url || '/static/assets/images/noimage.png';
}

const paletteLen = 5; // Same as .median-cut-X { ... } entries at gridlist.less

export default class GridList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {
        return (
            <Card.Group itemsPerRow={4}>
             {this.props.collection.map((e, i) => 
                e.card || 
                (<Card 
                    href={e.href}
                    header={e.header}
                    description={e.description}
                    image={getImage(e.url)}
                    key={i}
                    className={pickColorClass(i)}
                    meta={e.meta}
                />)
            )}
            </Card.Group>
        );
    }
}

GridList.propTypes = propTypes;

