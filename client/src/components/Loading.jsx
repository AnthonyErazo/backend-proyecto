import loadingSvg from '../assets/svg/loaderpages.svg';

function Loading() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh', backgroundColor: 'rgb(241, 242, 243)' }}>
            <img src={loadingSvg} alt="Loading" />
        </div>
    );
}

export default Loading;
