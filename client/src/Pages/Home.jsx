import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box, Button, Flex, useDisclosure, Input

} from '@chakra-ui/react'

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [notes, setNotes] = useState([])
  const [value, setValue] = useState("")

  useEffect(() => {

    const make_api_request = async () => {
      // package.json da proxy url verdik oradan gelecek önek
      try {

        const request = await fetch("http://127.0.0.1:8000/api/v1/notes", {

          headers: {
            "Content-type": "application/json"
          }
        })

        const response = await request.json()
        // state güncelle
        setNotes(response)
        console.log("data:", response)

      } catch (e) {

        console.log("e:", e)
      }



    }


    make_api_request()

  }, [])


  // yeni todo
  const makeRequest = async (event) => {

    event.preventDefault()

    const data = {

      task: value
    }

    const request = await fetch(`http://127.0.0.1:8000/api/v1/notes/create`, {
      // post ve put isteklerinde headers verilmeli
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)

    })
    const response = await request.json()

    console.log("C: gelen veri:", response)
    // frontend güncelle
    setNotes([...notes, response])
    // valueyi temizle
    setValue("")

    onClose()

  }

  return (
    <>

      <Box w="75%" m="auto" mt={5}>

        <Flex>
          <h3>AnaSayfa</h3>
          <Button onClick={onOpen} ms={'auto'} colorScheme='green' size={'sm'} variant={'ghost'}>+</Button>
        </Flex>

        <hr />

        {/* notlari maple */}
        <TableContainer mt={6} >
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Yapılacaklar</Th>
                <Th>Oluşturulduğu Tarih</Th>
              </Tr>
            </Thead>
            <Tbody>
              
                {notes.map((not) => {
                  return <Tr key={not.id}>
                    <Td><Link to={`/notlar/${not.id}`}>
                      <p>{not.task}</p>
                    </Link>
                    </Td>
                    <Td>{new Date(not.createdAt).toLocaleString("tr-TR")}</Td>
                  </Tr>
                })}
            </Tbody>
          </Table>
          
        </TableContainer>

      </Box>


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Not Ekle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <form onSubmit={makeRequest}>


              <Box>
                <Input onChange={(e) => setValue(e.target.value)} value={value} variant='flushed' placeholder='Task' />
              </Box>



              <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={onClose}>
                  İptal Et
                </Button>
                <Button type='submit' colorScheme='green'>Ekle</Button>
              </ModalFooter>

            </form>
          </ModalBody>

        </ModalContent>
      </Modal>

    </>
  )
}
