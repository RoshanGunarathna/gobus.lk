import '../styles/widget.css';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GroupIcon from '@mui/icons-material/Group';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import ChairIcon from '@mui/icons-material/Chair';

const Widget = ({type, valueData}) => {
    let data;

    switch (type) {
        case "booking":
            data={
                title:"Total Bookings",
                icon: (<AccountBalanceWalletIcon className='icon' />)
            }
            break;
        case "revenue":
            data={
                title:"Total Revenue",
                icon: (<ShowChartIcon className='icon' />),
                isRevenue: true
            }
            break;
        case "commuter":
            data={
                title:"Total Commuter",
                icon: (<GroupIcon className='icon' />)
            }
            break;
        case "route":
            data={
                title:"Total Route",
                value:50,
                icon: (<ForkRightIcon className='icon' />)
            }
            break;
        case "availableSeats":
            data={
                title:"Total Available Seats",
                icon: (<ChairIcon className='icon' />)
            }
            break;
        default:
            break;
    }
    
    return (
        <div className='widget'>
            <div className='left'>
                <span className='title'>{data.title}</span>
                <span className='value'>
                    {data.isRevenue ? `LKR ${valueData ?? 0}` : valueData ?? 0}
                </span>
            </div>
            <div className='right'>
                <div className='icon'>
                    {data.icon}
                </div>
            </div>
        </div>
    )
}

export default Widget