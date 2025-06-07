package me.agus.bookstore.controller;

import me.agus.bookstore.models.Member;
import me.agus.bookstore.services.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member savedMember = memberService.saveMember(member);
        return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member memberDetails) {
        return memberService.getMemberById(id)
                .map(existingMember -> {
                    existingMember.setAddress(memberDetails.getAddress());
                    existingMember.setPhoneNumber(memberDetails.getPhoneNumber());
                    existingMember.setEmail(memberDetails.getEmail());
                    // createdAt dan updatedAt dihandle otomatis
                    Member updatedMember = memberService.saveMember(existingMember);
                    return ResponseEntity.ok(updatedMember);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (memberService.getMemberById(id).isPresent()) {
            memberService.deleteMember(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
