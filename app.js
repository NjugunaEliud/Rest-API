const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json())

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log('App listening on port 3000');
    });
  }
});

app.get('/books', (req, res) => {
  const db = getDb();
  const page =req.query.p || 0
  const booksperpage= 3

  db.collection('books')
    .find()
    .sort({ author: 1 })
    .skip(page * booksperpage )
    .limit(booksperpage)
    .toArray()
    .then((books) => {
      res.status(200).json(books);
      
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Could not connect to the collection' });
    });
});

app.get('/books/:id',(req, res)=>{
    
    const db = getDb();
    const bookId = req.params.id;
    if(ObjectId.isValid){
        db.collection('books')
        .findOne({_id: new ObjectId(bookId)})
        .then((doc)=>{
            
            res.status(200).json(doc)
    
        })
        .catch(err=>{
            res.status(500).json({error:"Could not find the document"})
        })

    }
    else{
        res.status(500).json({ error: 'Book not found' });
        return;
    }
   
})

app.post('/books',(req, res)=>{
  const db = getDb();
    const book = req.body
    db.collection('books')
    .insertOne(book)
    .then((result)=>{
        res.status(201).json(result)
    })
    .catch(err=>{
        res.status(500).json({error:"Could not create a new document"})
    })

})

app.delete('/books/:id',(req, res)=>{
    
  const db = getDb();
  const bookId = req.params.id;
  if(ObjectId.isValid){
      db.collection('books')
      .deleteOne({_id: new ObjectId(bookId)})
      .then((doc)=>{
          
          res.status(200).json(doc)
  
      })
      .catch(err=>{
          res.status(500).json({error:"Could not find the document"})
      })

  }
  else{
      res.status(500).json({ error: 'Book not found' });
      return;
  }
 
})

app.patch('/books/:id',(req, res)=>{
  const db = getDb();
  const updates = req.body
  const bookId = req.params.id;
  if(ObjectId.isValid){
    db.collection('books')
    .updateOne({_id: new ObjectId(bookId)},{$set: updates})
    .then((doc)=>{
        
        res.status(200).json(doc)

    })
    .catch(err=>{
        res.status(500).json({error:"Could not update the document"})
    })

}
else{
    res.status(500).json({ error: 'Book not found' });
    return;
}

})

