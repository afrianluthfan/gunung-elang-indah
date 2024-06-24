import React, { FC } from "react";
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  ModalBody,
} from "@nextui-org/react";

interface ModalComponentProps {
  ButtonText: string;
}

const ModalComponent: FC<ModalComponentProps> = ({ ButtonText }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="success"
        onPress={onOpen}
        className="bg-[#00DC16] font-bold text-white"
      >
        {ButtonText}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="flex h-full w-full items-center justify-center text-center">
                <p className="mt-5 text-black">Apakah anda menyetujui order?</p>
              </ModalBody>
              <ModalBody className="flex flex-row justify-center">
                <Button
                  color="success"
                  className="w-full text-white"
                  onPress={onClose}
                >
                  Setujui
                </Button>
                <Button className="w-full" onPress={onClose}>
                  Batal
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComponent;
