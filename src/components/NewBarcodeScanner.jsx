import React, { useEffect } from 'react'
import Quagga from '@ericblade/quagga2'
import { useNavigate } from 'react-router-dom'

export default function NewBarcodeScanner({ onSave }) {
  const navigate = useNavigate()

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#reader'),
          constraints: {
            facingMode: 'environment',
            width: 1280,
            height: 720,
          },
        },
        decoder: {
          readers: [
            'code_39_reader',
          ],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 10,
        locate: true
      },
      (err) => {
        if (err) {
          console.error('Quagga initialization failed:', err)
          return
        }
        console.log('Quagga initialization succeeded')
        Quagga.start()
      }
    )

    Quagga.onDetected((result) => {
      if (result && result.codeResult) {
        console.log('Barcode detected:', result.codeResult.code)
        onSave(result.codeResult.code)
        Quagga.stop()
        navigate('/photos')
      }
    })

    return () => {
      Quagga.stop()
    }
  }, [onSave, navigate])

  return (
    <div>
      <div 
        id="reader" 
        style={{ 
          width: '100vw', 
          height: '100vh',
          position: 'relative'
        }} 
      />
    </div>
  )
}