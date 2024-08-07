"use client";
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { firestore } from "@/firebase"; // Ensure this is correct
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  gap: "16px",
  display: "flex",
  flexDirection: "column",
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    updatePantry();
  }, []);

  const updatePantry = async () => {
    const snapshot = await getDocs(collection(firestore, 'pantry'));
    const items = snapshot.docs.map(doc => doc.data().name || '');
    const pantryList = Object.entries(
      items.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, count]) => ({ name, count }));
    console.log(pantryList);
    setPantry(pantryList);
  };

  const addItems = async (itemName) => {
    if (itemName.trim() === '') {
      console.log('Item name cannot be empty');
      return;
    }

    try {
      await addDoc(collection(firestore, 'pantry'), { name: itemName });
      console.log(`Item added: ${itemName}`);
      updatePantry();
    } catch (error) {
      console.error('Error adding item: ', error);
    }
  };

  const removeItem = async (name) => {
    const snapshot = await getDocs(collection(firestore, 'pantry'));
    const itemToDelete = snapshot.docs.find(doc => doc.data().name === name);
    if (itemToDelete) {
      try {
        await deleteDoc(doc(firestore, "pantry", itemToDelete.id));
        console.log(`Item removed: ${itemToDelete.id}`);
        updatePantry();
      } catch (error) {
        console.error('Error removing item: ', error);
      }
    }
  };

  const filteredPantry = pantry.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Items
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Items"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={async () => {
                await addItems(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add
      </Button>

      <TextField
        id="search-bar"
        label="Search Items"
        variant="outlined"
        width="5px"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box border={'1px solid #333'}>
        <Box width="800px" height="100px" bgcolor={'#ADD8E6'}>
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>

        <Stack width="800px" height="200px" spacing={2} sx={{ overflow: 'auto' }}>
          {filteredPantry.map((item) => (
            <Box
              key={item.name}
              width="100%"
              height="100px"
              display={'flex'}
              justifyContent={'space-between'}
              paddingX={5}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
            >
              <Typography
                variant={'h4'}
                color={'#333'}
                textAlign={'center'}
                fontWeight={'500'}
              >
                {typeof item.name === 'string' ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : 'Invalid Item'}
                {item.count > 1 && ` (x${item.count})`}
              </Typography>
              <Button
                variant='contained'
                onClick={() => removeItem(item.name)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
