package com.sumitcoder.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sumitcoder.dto.AnnouncementDto;
import com.sumitcoder.entity.Announcement;
import com.sumitcoder.exception.ResourceNotFoundException;
import com.sumitcoder.repository.AnnouncementRepository;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    /**
     * UPDATED: This method now fetches announcements in a paginated format.
     * @param pageable The pagination information (page, size, sort).
     * @return A Page of AnnouncementDto objects.
     */
    public Page<AnnouncementDto> getAllAnnouncements(Pageable pageable) {
        Page<Announcement> announcementsPage = announcementRepository.findAll(pageable);
        return announcementsPage.map(this::convertToDto);
    }

    @Transactional
    public AnnouncementDto createAnnouncement(AnnouncementDto announcementDto) {
        Announcement announcement = new Announcement();
        announcement.setTitle(announcementDto.getTitle());
        announcement.setContent(announcementDto.getContent());
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return convertToDto(savedAnnouncement);
    }

    @Transactional
    public AnnouncementDto updateAnnouncement(Long id, AnnouncementDto announcementDto) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + id));
        
        announcement.setTitle(announcementDto.getTitle());
        announcement.setContent(announcementDto.getContent());
        
        Announcement updatedAnnouncement = announcementRepository.save(announcement);
        return convertToDto(updatedAnnouncement);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement not found with id: " + id);
        }
        announcementRepository.deleteById(id);
    }
    
    private AnnouncementDto convertToDto(Announcement announcement) {
        AnnouncementDto dto = new AnnouncementDto();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setContent(announcement.getContent());
        dto.setCreatedAt(announcement.getCreatedAt());
        return dto;
    }
}

