export default function HeaderMenu(props) {
    return (
        <header
        style={{
            position: 'absolute',
            width: '100%',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: '#212931AA',
            minHeight: '40px',
            display: 'flex',
            justifyContent: 'end'
        }}>
            <span
            style={{
                fontFamily: 'Open Sans sans-serif',
                fontSize: '12px',
                fontWeight: '400',
                borderRadius: '10px',
                color: '#9AA5B1',
                border: '1px solid #6c6c6c',
                padding: '5px',
                margin: '10px',
                cursor: 'pointer'
            }}
            onClick={function() {
                if (props.heroe == 'marvel'){
                    props.toogle('ironMan')
                } else {
                    props.toogle('marvel')
                }
            }}
            >Switch</span>
        </header>
    )
}