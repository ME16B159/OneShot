const { MongoClient, FindCursor } = require('mongodb');

async function main(){

        const srchclg = await findbyname("Pacific Adventist University");
        //console.log(srchclg);
        const coursechoice = await srchclg.courses;
        const clgloc = await srchclg.city;
        const numstu = await srchclg.student;
        //console.log(coursechoice);
        //const nearclgs = await similarclgs(clgloc);
        coursechoice.forEach((course,i) =>{
        //console.log(course);
        similarclgs(srchclg, course);
        });
}

main().catch(console.error);



async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};



async function findbyname(nameofclg) 
{   
    const uri = "mongodb+srv://vignesh:Vicky%400503@cluster0.efwdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try 
    {
    await client.connect();
    const result = await client.db("tdb").collection("coll3").findOne({college : nameofclg});
    if(result) {
        console.log(`Found College : '${nameofclg}'`);
        console.log(result);
        return result;   
    }
    else{
        console.log(`No College Found by name '${nameofclg}'`);
    }
    }
    catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


async function similarclgs(clg, crs) 
{   
    const uri = "mongodb+srv://vignesh:Vicky%400503@cluster0.efwdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try 
    {
    await client.connect();
    const stugr=clg.students-100;
    const stulr=clg.students+100;
    const cursor = client.db("tdb").collection("coll3").find({courses : crs, students : {$gte : stugr, $lte : stulr}  }).sort({students : -1});
    const results = await cursor.toArray();
    
        if (results.length>1)
        {
            console.log(`Found nearby clgs with course '${crs}'`);
            results.forEach((result, i) => 
            {   
                if(result.college != clg.college)
                {
                console.log( `college : ${result.college}`);
                console.log(` _id : ${result._id}`);
                console.log(`year : ${result.year}`);
                console.log(`location : ${result.city}`);
                console.log(`students : ${result.students}`);
                console.log(`courses : ${result.courses}`);
                console.log("\n")
                }
            
            });
        }
        else
        {
            console.log(`No nearby clg found offering course '${crs}'`);
        }
    }
    catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


async function findbycourses(coursechoice) 
{
    const uri = "mongodb+srv://vignesh:Vicky%400503@cluster0.efwdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try 
    {
    await client.connect();
        const cursor = client.db("tdb").collection("coll3").find({courses : coursechoice}).sort({student : -1});
        const results = await cursor.toArray();
    
        if (results.length>0)
        {
            console.log(`Found clgs with course '${coursechoice}'`);
            results.forEach((result, i) => 
            {
                console.log( `college : ${result.college}`);
                console.log(` _id : ${result._id}`);
                console.log(`year : ${result.year}`);
                console.log(`location : ${result.city}`);
                console.log(`students : ${result.student}`);
                console.log(`courses : ${result.courses}`);
            
            });
        }
        else
        {
            console.log(`No clg found offering course '${coursechoice}'`);
        }
    }
    catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}