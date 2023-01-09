import {connect, ConnectOptions} from 'mongoose';
const MONGO_URI = 'mongodb+srv://anunay:vpPtodwYunron2KN@cluster0.6cilppr.mongodb.net/foodmine?retryWrites=true&w=majority'

export const dbConnect = () => {
    connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("connect successfully"),
        (error) => console.log(error)
    )
}