import { Modal, DatePicker, Form, Spin } from 'antd';
import dayjs from 'dayjs';

type SelectDateDialogProps = {
  isModalOpen: boolean,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  newVotingTime: number | null,
  setNewVotingTime: React.Dispatch<React.SetStateAction<number | null>>,
}

export default function SelectDateDialog({ isModalOpen, setIsModalOpen, newVotingTime, setNewVotingTime }: SelectDateDialogProps) {
  const [form] = Form.useForm()
  return (
    <Modal title='Select when voting ends' open={isModalOpen} okText='Confirm' cancelText='Cancel' okButtonProps={{ autoFocus: true }}
      onCancel={() => setIsModalOpen(false)} onOk={
        async () => {
          try {
            const values = await form.validateFields()
            form.resetFields()
            setNewVotingTime(values.DatePicker.diff(dayjs(), 'seconds'))
          }
          catch (error) { }
        }
      }
      destroyOnClose
    >
      <Form form={form} className='datepicker-form' variant='filled' style={{ maxWidth: 600 }}>
        <Form.Item key={0} label='Date' name='DatePicker' rules={[{ required: true, message: 'Please insert date' }]}>
          <DatePicker disabled={newVotingTime !== null} showTime format='DD.MM.YYYY. HH:mm:ss' disabledDate={(current) => {
              return current && current < dayjs().endOf('day')
            }} 
          />
        </Form.Item>
      </Form>
      {newVotingTime !== null && <div className='spinner'><Spin /></div>}
    </Modal>
  )
}
