<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Users extends CI_Controller {

   /**
    * Get All Data from this method.
    *
    * @return Response
   */
   public function index()
   {
       $this->load->database();

       if(!empty($this->input->get("search"))){
          $this->db->like('name', $this->input->get("search"));
          $this->db->or_like('description', $this->input->get("search")); 
       }

       $this->db->limit(5, ($this->input->get("page",1) - 1) * 5);
       $query = $this->db->get("users");
       $data['data'] = $query->result();
       $data['total'] = $this->db->count_all("users");

       echo json_encode($data);
   }

   /**
    * Store Data from this method.
    *
    * @return Response
   */
   public function store()
   {
       $this->load->database();

       $insert = $this->input->post();
       $this->db->insert('users', $insert);
       $id = $this->db->insert_id();
       $q = $this->db->get_where('users', array('id' => $id));

       echo json_encode($q->row());
    }

   /**
    * Edit Data from this method.
    *
    * @return Response
   */
   public function edit($id)
   {
       $this->load->database();
       $q = $this->db->get_where('users', array('id' => $id));
       echo json_encode($q->row());
   }

   /**
    * Update Data from this method.
    *
    * @return Response
   */
   public function update($id)
   {
       $this->load->database();

       $insert = $this->input->post();
       $this->db->where('id', $id);
       $this->db->update('users', $insert);
       $q = $this->db->get_where('users', array('id' => $id));

       echo json_encode($insert);
    }

   /**
    * Delete Data from this method.
    *
    * @return Response
   */
   public function delete($id)
   {
       $this->load->database();

       $this->db->where('id', $id);
       $this->db->delete('users');

       echo json_encode(['success'=>true]);
    }

}
