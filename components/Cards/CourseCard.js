import {Card, Batch, Badge} from 'antd'
import Link from 'next/link'

//const {Meta}= Card;

const CourseCard = ({course})=>{

    const {name,instructor, price, image, slug, paid, category}=course;
    return (<Link href={`/course/${slug}`}>
        <a>
        <Card
        hoverable
        className='mb-4'
        cover={
            <img src= {image.Location} alt={name} style={{height:"200px" , objectFit:"cover"}} className="p-1" />
        }>
        <h3 className='font-weight-bold'>{name}</h3>
        <p>by {instructor.name}</p>
        <Badge
        count={category}
        style={{backgroundColor: "#03a9f4"}}
        className="pb-2 mr-2" />
        {
            paid && 
            <h4 className='pt-2'>&#8377;{price}</h4>
        }
        {
            !paid &&
            <h4 className='pt-2'>Free</h4>

        }
        </Card>
        </a>
    </Link>);

}

export default CourseCard;
